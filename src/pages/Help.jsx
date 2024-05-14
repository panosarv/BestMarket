import React from 'react';
import '../styles/Help.css';
function Help() {
    return (
        <div className='help-container'>
            <h1>Welcome your BestMarket, your personal grocerries-shopping assistant</h1>
            <div className="grid">
                <div className="cell"><img src="./help-image-1.png" alt="Help 1" /></div>
                <div className="cell"><p>Not sure which product to buy? Filter and select through an extensive variaty of categories and let us find you the best product from each one</p></div>
                <div className="cell"><p>Browse each category to find exactly the product you are looking for and add it in your cart</p></div>
                <div className="cell"><img src="./help-image-2.png" alt="Help 2" /></div>
                <div className="cell"><img src="./help-image-3.png" alt="Help 3" /></div>
                <div className="cell"><p>Fill your information and let us, using our AI models recommend the best choice to get your groceries for that specific day time and place.</p></div>
                <div className="cell"><p>Wanting to plan ypur groceries for the whole week? Create an Account and save your cart to easily access it whenever you want!</p></div>
                <div className="cell"><img src="./help-image-4.png" alt="Help 4" /></div>

            </div>
        </div>
    );
}

export default Help;
