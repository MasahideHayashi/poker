import React from "react";
import Card from "./Card";

interface OpponentHandProps {
  cards: number[];
  isShowDown: boolean;
}

const OpponentHand: React.FC<OpponentHandProps> = ({ cards, isShowDown }) => {
  return (
    <div className="opponent">
      相手のカード<br />
      {cards.map((card) => (
        <Card
          key={card}
          card={card}
          isShowDown={isShowDown}
          owner='opponent'
        />
      ))}
    </div>
  );
};

export default OpponentHand;
