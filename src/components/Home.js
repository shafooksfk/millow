import { ethers } from "ethers";
import { useEffect, useState } from "react";

import close from "../assets/close.svg";

const Home = ({ home, provider, account, escrow, togglePop }) => {
  const [owner, setOwner] = useState(null);
  const [buyer, setBuyer] = useState(null);
  const [seller, setSeller] = useState(null);
  const [lender, setLender] = useState(null);
  const [inspector, setInspector] = useState(null);

  const [hasBought, setHasBought] = useState(false);
  const [hasSold, setHasSold] = useState(false);
  const [hasLended, setHasLended] = useState(false);
  const [hasInspected, setHasInspected] = useState(false);

  const fetchDetails = async () => {
    // buyer
    const buyer = await escrow.buyer(home.id);
    setBuyer(buyer);

    const hasBought = await escrow.approval(home.id, buyer);
    setHasBought(hasBought);

    // seller
    const seller = await escrow.seller();
    setSeller(seller);

    const hasSold = await escrow.approval(home.id, seller);
    setHasSold(hasSold);
    // lender
    const lender = await escrow.lender();
    setLender(lender);

    const hasLended = await escrow.approval(home.id, lender);
    setHasLended(hasLended);
    // inspector
    const inspector = await escrow.inspector();
    setInspector(inspector);

    const hasInspected = await escrow.approval(home.id, inspector);
    setHasInspected(hasInspected);
  };

  const fetchOwner = async () => {
    if (await escrow.isListed(home.id)) return;

    const owner = await escrow.buyer(home.id);
    setOwner(owner);
  };

  useEffect(() => {
    fetchDetails();
    fetchOwner();
  }, [hasSold]);
  return (
    <div className="home">
      <div className="home__details">
        <div className="home__image">
          <img src={home.image} alt="Home" />
        </div>
        <div className="home__overview">
          <h1>{home.name}</h1>
          <p>
            <strong>{home.attributes[2].value}</strong> bds |
            <strong>{home.attributes[3].value}</strong> ba |
            <strong>{home.attributes[4].value}</strong> sqft |
          </p>
          <p>{home.address}</p>
          <h2>{home.attributes[0].value} ETH</h2>
          {owner ? (
            <div className="home__owned">
              Owned by {owner.slice(0, 6) + "..." + owner.slice(38, 42)}
            </div>
          ) : (
            <div>
              {account === inspector ? (
                <button className="home__buy">Approve Inspection</button>
              ) : account === lender ? (
                <button className="home__buy">Approve & Lend</button>
              ) : account === seller ? (
                <button className="home__buy">Approve & Sell</button>
              ) : (
                <button className="home__buy">Buy</button>
              )}
              <button className="home__contact">Contact agent</button>
            </div>
          )}

          <hr />
          <h2>Overview</h2>
          <p>{home.description}</p>
          <hr />
          <h2>Facts & Features</h2>
          <ul>
            {home.attributes.map((attribute, index) => (
              <li key={index}>
                <strong>{attribute.trait_type}</strong> : {attribute.value}
              </li>
            ))}
          </ul>
        </div>
        <button className="home__close" onClick={togglePop}>
          <img src={close} alt="Close" />
        </button>
      </div>
    </div>
  );
};

export default Home;
