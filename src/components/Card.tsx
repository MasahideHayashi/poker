type CardProps = {
  card: number,
  isShowDown: boolean,
  owner: 'player' | 'opponent',
  isSelected?: boolean,
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void,
};

const Card: React.FC<CardProps> = ({
  card, 
  isShowDown, 
  owner,
  isSelected,
  onClick,
}) => {
  const showCard = (card: number) => {
    if (card === 0) return "Joker";
    const mark = ["♥", "♦", "♣", "♠"];
    const number = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    return mark[Math.floor((card-1) / 13)] + number[(card-1) % 13];
  }
  
  return (
    <>
      <button
        value={card}
        className={`button ${isSelected ? "selected" : ""}
                    ${isShowDown && card <= 26 ? "red" : "black"}
                    ${owner==='player' && card <= 26 ? "red" : ""}`}
        disabled={owner==='opponent'}
        onClick={onClick}
      >
        {isShowDown ? showCard(card) : "??"}
      </button>
    </>
  )
}

export default Card;