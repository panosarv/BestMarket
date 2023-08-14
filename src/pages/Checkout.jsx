import React, { useState, ChangeEvent } from 'react';

function Checkout() {
  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleOptionChange = ():  => {
    setSelectedOption(target.value);
  };

  return (
    <div>
      <label>Car</label>
      <br />
      <input
        type="radio"
        id="car"
        value="car"
        checked={selectedOption === 'car'}
        onChange={handleOptionChange}
      />
      <label htmlFor="public">Motocycle</label>
      <br />
      <input
        type="radio"
        id="motocycle"
        value="Motocycle"
        checked={selectedOption === 'motocycle'}
        onChange={handleOptionChange}
      />
      <label htmlFor="foot">By foot</label>
      <br />
      <input
        type="radio"
        id="foot"
        value="foot"
        checked={selectedOption === 'foot'}
        onChange={handleOptionChange}
      />
      <label htmlFor="car">Public transportation</label>
      <br />
      <input
        type="radio"
        id="public"
        value="public"
        checked={selectedOption === 'public'}
        onChange={handleOptionChange}
      />
    </div>
  );
}

export default Checkout;