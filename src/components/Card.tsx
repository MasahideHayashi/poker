type CardProps = {
  card: number,
  isShowDown: boolean,
  showCard: (card: number) => string,
};

const Card: React.FC<CardProps> = ({
  card, 
  isShowDown, 
  showCard
}) => {
  return (
    <>
      <button
        key={card}>

      </button>
    </>
  )
}

export default Card;