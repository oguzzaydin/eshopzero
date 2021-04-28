import React, { createContext, useState } from "react";

const BasketContext = createContext({ baskets: {} });

function BasketProvider({ ...rest }) {
  let [basket, setBaskets] = useState([]);
  let [count, setCount] = useState(0);

  return (
    <BasketContext.Provider
      value={{
        basket: basket || [],
        count: basket.length,
        resetCount: () => setCount(0),
        updateBasket: (value) => {
          setBaskets(value);
          count++;
          setCount(count);
        },
      }}
    >
      {rest.children}
    </BasketContext.Provider>
  );
}

const BasketConsumer = BasketContext.Consumer;

export { BasketProvider, BasketConsumer, BasketContext };
