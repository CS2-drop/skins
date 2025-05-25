import React, { useState } from 'react';
import gsap from 'gsap';

const dummyCase = {
  title: "Revolver Case",
  image: "/images/revolver_case.png",
  description: "Open for a chance to win rare skins!",
  items: [
    { name: "AWP | Dragon Lore", image: "/images/awp_dragonlore.png", rarity: "legendary" },
    { name: "AK-47 | Neon Rider", image: "/images/ak_neonrider.png", rarity: "rare" },
    // ... add more
  ]
};

const CaseOpener: React.FC = () => {
  const [opening, setOpening] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleOpenCase = () => {
    setOpening(true);
    // Animation sequence (simplified)
    gsap.to('.case-items', {
      x: '-=500', // fake scroll effect
      duration: 2,
      ease: "power2.inOut",
      onComplete: () => {
        // Pick a random item as result
        const item = dummyCase.items[Math.floor(Math.random() * dummyCase.items.length)];
        setResult(item);
        setOpening(false);
      }
    });
  };

  return (
    <section className="case-opener">
      <h1>{dummyCase.title}</h1>
      <img src={dummyCase.image} alt={dummyCase.title} className="case-image" />
      <p>{dummyCase.description}</p>
      <div className="case-items">
        {dummyCase.items.map((item, idx) => (
          <img key={idx} src={item.image} alt={item.name} className={`skin-img ${item.rarity}`} />
        ))}
      </div>
      <button className="open-case-btn neon-btn" onClick={handleOpenCase} disabled={opening}>
        {opening ? 'Opening...' : 'Open Case'}
      </button>
      {result && (
        <div className="result-modal">
          <h2>Congratulations!</h2>
          <img src={result.image} alt={result.name} />
          <p>You won: {result.name}</p>
        </div>
      )}
    </section>
  );
};

export default CaseOpener;