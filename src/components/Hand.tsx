import React from "react";
import Card from "./Card";

interface HandProps {
  cards: number[];
  selectedCard: boolean[];
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isShowDown?: boolean;
}

const Hand: React.FC<HandProps> = ({ cards, selectedCard, onClick, isShowDown=true }) => {
  return (
    <div className="player">
      あなたのカード<br />
      {cards.map((card, index) => (
        <Card
          key={card}
          card={card}
          isShowDown={isShowDown}
          isSelected={selectedCard[index]}
          onClick={onClick}
          owner='player'
        />
      ))}
    </div>
  );
};

export default Hand;
