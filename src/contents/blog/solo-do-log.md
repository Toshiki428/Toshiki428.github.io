---
title: '個人開発アプリ「SoloDo」の制作裏話'
date: '2025-07-21'
tags: ['React', 'TypeScript', '個人開発']
---

## SoloDoとは

「Solo（自分で）＋Do（やる）」という意味で名前を考えた、自律学習Webアプリです。

ポモドーロテクニックの時間で動くタイマーがあり、勉強や作業のログを確認したり分析することができます。

ブラウザ上で動作するので、インストールの必要がなく、PCでもスマホでも使えます。

また、データはブラウザ上に保存されているので、初回以外はネットワークに繋がっていない環境でも使うことができます。

今の時点では、このアプリはサーバ（バックエンド）側の処理を記述しない、サーバレスなアプリになっています。

## バージョン1で実装した機能

バージョン1で実装したのは、タイマーと、ログを確認できる部分です。

タグの追加や削除、履歴の削除なども実装しています。

## 設計で悩んだポイント

### 1. 責任の分離

今回、初めてReactを使いました。

なので、コンポーネント・コンテキスト・それぞれのページにどのぐらいの責任を持たせるべきか、悩みながら開発を進めていきました。

例えば、`App.tsx`は**全体の共通レイアウトやルーティング定義を置く場所**として、それぞれのページは`pages/`ディレクトリ内に書きます。

これにより、`App.tsx`は「家の間取り」、`pages/`内は「部屋内のデザイン」のように責任の持たせる場所をわかりやすくできます。

### 2. システム構成

また、今回はタイマーをアプリ全体で使えるようにしたいという要件がありました。  
それが`TimerContext`なのですが、「`App.tsx`とどちらの方が上であるべきか」と言う部分に悩みました。

最終的に今回のアプリでは「アプリ共通で使えるタイマー機能」という考え方で`TimerContext`の方を上にしましたが、逆の結論もあり得ると感じています。

`今回のシステム構成`

```
TimerContext（タイマー状態管理）
└─ App.tsx（アプリ全体）
    ├─ Home.tsx（操作・表示UI）
    ├─ Log.tsx（履歴表示）
    └─ 分析.tsx（将来的に進捗を視覚化）
```

## 開発中にハマったこと & 解決法

大きく4つあり、それぞれできるだけ簡潔にまとめます。

### 1. バックグラウンドではタイマーがおかしくなる

元々は1秒間に1回、表示している秒数を減らすことでタイマーを実装していました。

```ts
useEffect(() => {
    let interval: number | undefined;
    if (isRunning) {
        interval = window.setInterval(() => {
        	setTime((prevTime) => prevTime - 1);
        }, 1000);
    }
    return () => window.clearInterval(interval);
}, [isRunning]);
```

常にその画面を開いているのであれば、これで問題ありません。  
しかし、ブラウザの他のタブを開いている時、つまり**バックグラウンドタブでは`setInterval`の呼ばれる間隔が遅くなる**ようです。

SoloDoでタイマーを動かしながら、別のタブで調べ物をすることもあるはずです。

これはリリース前に改善しなければならないと言うことで、方法を変え、次の計算で時間を表示するようにしています。

```
経過時間 = 今の時間 - タイマーの開始時間
画面に表示する時間 = 25分 - 経過時間
```

これにより、`setInterval`で実行される間隔が伸びても経過時間は正確に計算できます。

### 2. リロード時にタイマーがリセットされる問題

`useState`で時間を管理していると、画面遷移やリロードのたびにReactのコードが再マウントされ、動いているタイマーがリセットされます。

そこで、ブラウザの`localStrage`を使いました。

具体的な流れは以下のようになっています。

1. タイマーの状態が変化するたびに、その状態を`localStorage`に保存する。（下の画像）
2. コンポーネントがマウントされた時に、保存されている状態があれば`localStorage`から状態を読み込む。
3. バックグラウンドでの時間経過の計算。

![localStrageの画像](/images/blog/solo-do-log.png)

### 3. stateが更新されない問題

次のようなコードで、ロジック的には更新されるはずなのに更新されませんでした。

```ts
const [remaining, setRemaining] = useState<number>(STUDY_DURATION);

useEffect(() => {
	const tick = () => {
		setRemaining(STUDY_DURATION - elapsed.current); //remainingを更新
		console.log(`Remaining time: ${remaining}`); // ← この値がずっと初期値だった
	};
	tick();
	const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
}, [isRunning, mode]);
```

これは**Reactの`State`の更新が非同期であること**と、**`Stale Closure`という現象**が原因です。

実は、Reactの`State`の値を更新しても、その変更はすぐには反映されません。  
パフォーマンスのために、状態の変更と再レンダーをバッチ処理で行うためです。

つまり、この`console.log`は、新しい`remaining`が反映される前に実行されているということになります。

しかし、これだけであれば、リアルタイムではなくとも徐々に値が減っていくはずです。  
何度呼ばれても値が減らなかった理由は、「クロージャの罠」です。

クロージャとは、ある関数が定義された時点での変数をずっと覚えている仕組みです。

つまり、`tick()`内で使っている`remaining`は`tick()`が定義された時点での値になっています。

`remaining`を依存配列に持っていないので、`remaining`が更新されたときに関数が再定義されません。  
よって、古い値を常に参照し続けるようになってしまいます。

ちなみに、`isRunning`と`mode`はタイマーが動き出すタイミングにしか変わらないため、`tick()`が再定義されずに`setInterval`で繰り返し呼ばれます。  
だから、表示される`remaining`が変わらないという状況でした。

この問題は、新しい`useEffect`に`remaining`を依存関係として入れることで解決しました。

```ts
useEffect(() => {
	const tick = () => {
		setRemaining(STUDY_DURATION - elapsed.current); //remainingを更新
	};
	tick();
	const interval = setInterval(tick, 1000);
	return () => clearInterval(interval);
}, [isRunning, mode]);

useEffect(() => {
	console.log(`Remaining time:: ${remaining}`);
}, [remaining]);
```

### 4. localStorageがリロード時に消える

このようなコードを書いていました。

```ts
// A
useEffect(() => {
	const savedTags = localStorage.getItem('solodo-tags');
	if (savedTags) {
		setSelectedTags(JSON.parse(savedTags));
	}
}, []);

// B
useEffect(() => {
	localStorage.setItem('solodo-tags', JSON.stringify(selectedTags));
}, [selectedTags]);
```

`selectedTags`が更新されたら`solodo-tags`として`localStorage`にセットします。

ブラウザの開発者ツールで見るとしっかりと追加されていることも確認できました。

しかし、リロードすると`solodo-tags`の値が空になってしまいます。

原因は、「最初に実行される`useEffect()`の順序は決まっていない」ということです。

今回の場合、このアプリが最初に表示されたときに`A`も`B`も動き、`setSelectedTags()`が実行される前に`setItem`で空をsetしてしまっているということです。

そこで、次のような専用のカスタムフックを作り、値を取得する方を先に実行させることで解決しました。

```ts
import { useState, useEffect } from 'react';
  
export function usePersistentState<T>(
	key: string,
	defaultValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const [state, setState] = useState<T>(() => {
		const saved = localStorage.getItem(key);
		return saved ? JSON.parse(saved) : defaultValue;
	});
	  
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state));
	}, [state]);
	  
	return [state, setState];
}
```

## 工夫した点

- タイマーの状態を`TimerContext`として分離し、再利用性・保守性を向上
- `localStrage`の利用により、リロード時のタイマー継続が可能
- `useEffect`のクロージャ問題を理解し、依存配列を適切に設定
- `indexedDB`を使い、オフラインでも使えるように設計
- タイマー中のタグ変更や二重起動など、UXを損なう操作を防ぐガードを実装
- 一気に大規模化せず、「バージョン1」としての着地点を明確にしてリリース

## 今後やりたいこと（v2以降）

- 履歴の編集（タグの追加、時間の変更など）
- 分析ページの実装（タグごとの累計時間、週や月ごとの累計時間など）
- タイマーのカスタマイズ（自由に勉強時間と休憩時間を設定）
- タグの並べ替え
- クラウド同期（複数の端末で使えるように）
- TailwindCSSの導入

## Reactと向き合って見えたもの

Reactは状態管理が特殊だと感じました。  
`useState`と`useRef`で主にデータを管理し、そのためのロジックは`useEffect`の依存配列で起動することができます。  
はじめは混乱しましたが、状態更新の非同期性・クロージャ問題にぶつかったとき、しっかりと時間を使って理解を進めました。

また、ブラウザの便利さも実感しました。  
このアプリを作るときに「**ネット環境がなくても動くものにしたい**」と思い、スタンドアロン型のアプリにしようかと考えていました。  
しかし、それだとインストールの壁があり、気軽に使ってもらえないと感じ、ブラウザ上で実装したいという気持ちがありました。

そこで、調査を進めると、**PWA（Progressive Web App）**という技術があることを知り、このアプリはキャッシュが消えない限りオフラインでも使えるようになっています。  
また、それと同時に`IndexedDB`を使い、データの保存場所をサーバではなくローカルにすることで履歴の参照もオフラインでできるようになっています。  
つまり、このアプリはバックエンドがなくフロントエンドだけで完結するアプリになっています。

他にも、タイマー、モード、タグなど、状態の管理をどうするか、コンテキストで扱うものとコンポーネントで扱うべきものの違いなども学びました。  
**データの管理・共有をするためのものがコンテキスト**、**UIの表示・操作するためのものをコンポーネント**という形で扱っています。

最後になりますが、今回初めてReactを使って開発を進めました。  
その中で、過去学んだことがない`useEffect`があり、詰まった部分がありました。  
でも理解を進めることで「開発を進めやすい」と感じましたし、バージョン1としては納得がいくものを作れたと思います。

今までは特定の人に使ってもらうようなシステムしか作ったことがなく、全体に公開する前提で作ったのは今回が初めてでしたが、どうしたら使いやすいかを考えて開発するのが楽しかったです。
