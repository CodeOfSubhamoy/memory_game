import React, { useEffect, useState } from "react";

const Memorygame = () => {
  const [gridSize, setGridSize] = useState(4);
  const [cards, setCards] = useState([]);
  const [flipped, setflipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setdisabled] = useState(false);
  const [won, setwon] = useState(false);

  const handleGridSizechange = (e) => {
    const size = parseInt(e.target.value);
    if (size >= 2 && size <= 10) setGridSize(size);
  };
  const initializeGame = () => {
    const totalCards = gridSize * gridSize;
    const pairs = Math.floor(totalCards / 2);
    const numbers = [...Array(pairs).keys()].map((e) => e + 1);
    const shufflecards = [...numbers, ...numbers]
      .sort(() => Math.random() - 0.5)
      .slice(0, totalCards)
      .map((number, index) => ({
        id: index,
        number,
      }));
    setCards(shufflecards);
    setflipped([]);
    setSolved([]);
    setwon(false);
  };
  const handleClick = (id) => {
    if (disabled || won) return;

    if (flipped.length == 0) {
      setflipped([id]);
      return;
    }
    // for the seconf card flip
    if (flipped.length == 1) {
      setdisabled(true);
      if (id !== flipped[0]) {
        setflipped([...flipped, id]);
        checkMatch(id);
      } else {
        setflipped([]);
        setdisabled(false);
      }
    }
  };
  const isFlipped = (id) => flipped.includes(id) || solved.includes(id);
  const isSolved = (id) => solved.includes(id);
  const checkMatch = (secondId) => {
    const [firstId] = flipped;

    if (cards[firstId].number == cards[secondId].number) {
      setSolved([...solved, firstId, secondId]);
      setflipped([]);
      setdisabled(false);
    } else {
      setTimeout(() => {
        setflipped([]);
        setdisabled(false);
      }, 1000);
    }
  };
  useEffect(() => {
    console.log("call");
    initializeGame();
  }, [gridSize]);

  useEffect(()=>{
    if(cards.length == solved.length && cards.length > 0) {
        setwon(true);
    }
  },[solved, cards]);

  const resetClick = () => {
    setSolved([]);
    setflipped([]);
    setwon(false);
    setdisabled(false);
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-grey-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Memory Game!</h1>
      {/** Input */}
      <div>
        <label htmlFor="gridSize"> Grid size: (max 10)</label>
        <input
          type="number"
          id="gridSize"
          min="2"
          max="10"
          value={gridSize}
          onChange={(e) => handleGridSizechange(e)}
          className="border-2 border-grey-300 rounded px-2 py-1 mb-6"
        />
      </div>
      {/** Game Board */}
      <div
        className="grid gap-2 mb-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize},minmax(0,1fr))`,
          width: `min(100%, ${gridSize * 6}rem)`,
        }}
      >
        {cards.map((card) => {
          return (
            <div
              key={card.id}
              onClick={() => handleClick(card.id)}
              className={`aspect-square flex items-center justify-center text-xl font-bold rounded-lg cursor-pointer transition-all duration-300  ${
                isFlipped(card.id)
                  ? isSolved(card.id)
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                  : "text-grey-400 bg-gray-200"
              }`}
            >
              {isFlipped(card.id) ? card.number : "?"}
            </div>
          );
        })}
      </div>
      {/** Result */}
      {won && (
        <div className="mt-4 text-4xl font-bold text-blue-700 animate-bounce">
          You Win!
        </div>
      )}
      {/** Reset and Play again button */}
      <button onClick={resetClick}
      className="mt-4 px-2 py-2 bg-green-500  text-white rounded hover:bg-green-700 transition-colors:">
        {won ? "Play Again" : "Reset"}
      </button>
    </div>
  );
};

export default Memorygame;
