import React, { createContext, useState } from "react";

const BasketContext = createContext({ baskets: {} });

function BasketProvider({ ...rest }) {
  const [basket, setBaskets] = useState([]);
  const [count, setCount] = useState(0);

  return (
    <BasketContext.Provider
      value={{
        basket: basket || [],
        count: count,
        resetCount: () => setCount(0),
        updateBasket: (value) => {
          setBaskets(value);
          setCount(prev => ++prev);
        },
      }}
    >
      {rest.children}
    </BasketContext.Provider>
  );
}

const BasketConsumer = BasketContext.Consumer;

export { BasketProvider, BasketConsumer, BasketContext };
