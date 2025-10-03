import React from 'react'
import './App.css'
import Hand from './components/Hand';
import OpponentHand from './components/OpponentHand';



// let canSelectCard: { [key: number]: boolean } = {};
// for (let i = 0; i <= 52; i++) {
//   canSelectCard[i] = true; 
// }
// canSelectCard[0] = false; // Jokerなし


function App() {
  const [canSelectCard, setCanSelectCard] = React.useState(() => {
    let initialState: { [key: number]: boolean } = {};
    for (let i = 0; i <= 52; i++) {
      initialState[i] = true;
    }
    initialState[0] = false; // Jokerなし
    return initialState;
  });

  const drawCard = React.useCallback((drawTimes: number) => {
    const newSelectCard = { ...canSelectCard };
    const cardList: number[] = [];
    while (drawTimes > 0) {
      let card = Math.floor(Math.random() * 53);
      while (!newSelectCard[card]) {
        card += 1;
        card %= 53;
      }
      newSelectCard[card] = false;
      cardList.push(card);
      drawTimes -= 1;
    }
    setCanSelectCard(newSelectCard);
    return cardList;
  }, [canSelectCard]);

  const initialDraw = React.useMemo(() => drawCard(10), []);

  // const myCards = [1, 0, 12, 52, 25];
  const [myCards, setMyCards] = React.useState(() => initialDraw.slice(0, 5));
  const [opponentCards] = React.useState(() => initialDraw.slice(5, 10));
  const [selectedCard, setSelectedCard] = React.useState([false, false, false, false, false]);
  const [canChangeCard, setCanChangeCard] = React.useState(true);
  const [isShowDown, setIsShowDown] = React.useState(false);
  const [resultMessage, setResultMessage] = React.useState("");

  const clickCard = (e: React.MouseEvent<HTMLButtonElement>) => {
    const newselectedCard = [...selectedCard];
    const index = myCards.indexOf(Number(e.currentTarget.value));
    newselectedCard[index] = !newselectedCard[index];
    setSelectedCard(newselectedCard);
  }

  const changeCards = () => {
    if (!canChangeCard) return;
    setCanChangeCard(false);
    const newMyCards = myCards.filter((_, index) => !selectedCard[index]);
    newMyCards.push(...drawCard(5-newMyCards.length));
    setMyCards(newMyCards);
    setSelectedCard([false, false, false, false, false]);
  }

  const showDown = () => {
    const myRank = rankOfAHand(myCards);
    const opponentRank = rankOfAHand(opponentCards);
    let message = "";
    if (myRank[0] > opponentRank[0]) {
      message = "あなたの勝ちです";
    } else if (myRank[0] < opponentRank[0]) {
      message = "あなたの負けです";
    } else {
      if (myRank[1] === 1 && opponentRank[1] !== 1) {
        message = "あなたの勝ちです";
      } else if (myRank[1] !== 1 && opponentRank[1] === 1) {
        message = "あなたの負けです";
      } else if (myRank[1] > opponentRank[1]) {
        message = "あなたの勝ちです";
      } else if (myRank[1] < opponentRank[1]) {
        message = "あなたの負けです";
      } else {
        message = "引き分けです";
      }
    }
    console.log("あなたの役:", myRank);
    console.log("相手の役:", opponentRank);
    setResultMessage(message);
    setIsShowDown(true);
  }

  const rankOfAHand = (cards: number[]) => {
    const suit = cards.map(card => Math.floor((card - 1) / 13));
    const num = cards.map(card => (card - 1) % 13 + 1).sort((a, b) => a - b);
    console.log(num);
    let numCount: { [key: number]: number } = {};
    num.forEach(n => {
      if (n in numCount) {
        numCount[n] += 1;
      } else {
        numCount[n] = 1;
      }
    });
    // maxKey: 一番多い枚数のカードの数字
    const maxKey = Object.keys(numCount).reduce((a:string, b:string) => numCount[Number(a)] > numCount[Number(b)] ? a : b);
    const rank = Number(maxKey);
    const counts = Object.values(numCount).sort((a, b) => b - a);
    const isFlush = suit.every(s => s === suit[0]);
    const isStraight = num.every((n, i) => i === 0 || n === num[i - 1] + 1) || (num[0] === 1 && num[1] === 10 && num[2] === 11 && num[3] === 12 && num[4] === 13);
    if (isFlush && isStraight && num[0] === 1) return [10,1]; // ロイヤルストレートフラッシュ
    if (isFlush && isStraight) return [9,Math.max(...num)]; // ストレートフラッシュ
    if (counts[0] === 4) return [8,Number(maxKey)]; // フォーカード
    if (counts[0] === 3 && counts[1] === 2) return [7,Number(maxKey)]; // フルハウス
    if (isFlush) return [6,num.includes(1)?1:Math.max(...num)]; // フラッシュ
    if (isStraight) return [5,num.includes(1)?1:Math.max(...num)]; // ストレート
    if (counts[0] === 3) return [4,Number(maxKey)]; // スリーカード
    if (counts[0] === 2 && counts[1] === 2) return [3,rank===1?1:rank]; // ツーペア
    if (counts[0] === 2) return [2,Number(maxKey)]; // ワンペア
    return [1,num.includes(1)?1:Math.max(...num)]; // ハイカード
  }
  return (
    <>
      <h1>Poker Game</h1>
      {/* <div className="opponent">
        相手のカード<br />
        {opponentCards.map((card) => (
          <Card 
            key={card} 
            card={card} 
            isShowDown={isShowDown} 
            owner='opponent' 
          />
        ))}
      </div> */}
      <OpponentHand cards={opponentCards} isShowDown={isShowDown} />
      {/* {myCards.map((card, index) => (
        <Card 
          key={card} 
          card={card} 
          isShowDown={true} 
          isSelected={selectedCard[index]} 
          owner='player' 
          onClick={clickCard} 
        />
      ))} */}
      <Hand 
        cards={myCards} 
        selectedCard={selectedCard} 
        onClick={clickCard} 
      />
      <div>
        交換可能回数: {canChangeCard ? "1回" : "0回"}<br />
        <button onClick={changeCards}>交換</button>
        <button onClick={showDown}>対戦</button>
      </div>
      {isShowDown && <div className="result">{resultMessage}</div>}
    </>
  )
}

export default App
