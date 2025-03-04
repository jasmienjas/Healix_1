import './App.css';

const paymentMethods = [
  {
    name: 'American Express',
    type: 'Cards',
    description: 'A multinational payment card company that issues and processes its own cards.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg',
  },
  {
    name: 'Visa',
    type: 'Cards',
    description: 'Visa credit and debit cards are accepted by businesses in over 200 countries.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
  },
  {
    name: 'Mastercard',
    type: 'Cards',
    description: 'The second largest payment card network in the world by transaction volume.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg',
  },
  {
    name: 'Maestro',
    type: 'Cards',
    description: 'A widely-recognized Mastercard brand, offering debit and prepaid cards.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Maestro_logo.svg',
  },
  {
    name: 'PayPal',
    type: 'Digital Wallets',
    description: 'With over 325 million accounts, this is the most popular online wallet in the world.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
  },
  {
    name: 'Apple Pay',
    type: 'Digital Wallets',
    description: 'A digital wallet for Apple iOS users, allowing convenient payments from anywhere.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Apple_Pay_logo.svg',
  },
  {
    name: 'Discover',
    type: 'Cards',
    description: 'Discover issues its own cards and processes payments through the Discover payment network.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/50/Discover_Card_logo.svg',
  },
  {
    name: 'Google Pay',
    type: 'Digital Wallets',
    description: 'The top mobile wallet for Android users, allowing convenient payments from anywhere.',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Google_Pay_Logo.svg',
  }
];

function App() {
  return (
    <div className="App">
      <nav className="navbar">
        <h2 className="logo">Pay.com</h2>
        <div className="nav-links">
          <a href="#">Online Payments</a>
          <a href="#">Product</a>
          <a href="#">Partners</a>
          <a href="#">Company</a>
          <a href="#">Developers</a>
          <a href="#" className="login">Log In</a>
          <button className="contact-btn">Contact Sales</button>
        </div>
      </nav>
      
      <div className="cards-container">
        {paymentMethods.map((method, index) => (
          <div key={index} className="card">
            <img src={method.logo} alt={method.name} className="card-logo" />
            <h3>{method.name}</h3>
            <p className="card-type">{method.type}</p>
            <p className="card-desc">{method.description}</p>
            <a href="#" className="learn-more">Learn more &gt;</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
