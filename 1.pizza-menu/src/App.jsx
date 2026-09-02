import './App.css'

const pizzaData = [
  {
    name: "Focaccia",
    ingredients: "Bread with italian olive oil and rosemary",
    price: 6,
    photoName: "focaccia.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Margherita",
    ingredients: "Tomato and mozarella",
    price: 10,
    photoName: "margherita.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Spinaci",
    ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
    price: 12,
    photoName: "spinaci.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Funghi",
    ingredients: "Tomato, mozarella, mushrooms, and onion",
    price: 12,
    photoName: "funghi.jpg",
    soldOut: false,
  },
  {
    name: "Pizza Salamino",
    ingredients: "Tomato, mozarella, and pepperoni",
    price: 15,
    photoName: "salamino.jpg",
    soldOut: true,
  },
  {
    name: "Pizza Prosciutto",
    ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
    price: 18,
    photoName: "prosciutto.jpg",
    soldOut: false,
  },
];


function App() {
  return (
    <div className='container'>
      <Header className="header"></Header>
      <Menu></Menu>
      <Footer></Footer>
    </div>
  )
}


function Header() {
  return <h1>Fast React Pizza Co.</h1>
}

function Menu() {
  return (
    <main className='menu'>
      <h2>Our menu</h2>

      {pizzaData && 
        <ul className='pizzas'>
          {pizzaData.map(p => {
            return(
              <Pizza 
                  name={p.name} 
                  ingrediants={p.ingredients}
                  photoName={p.photoName}
                  price={p.price}
                  soldOut={p.soldOut}
                  key={p.name}>
              </Pizza>
            )
          })}
        </ul>
      }
    </main>
  )
}

function Footer() {
  const hour = new Date().getHours();
  const openHour = 12;
  const closeHour = 22;

  const isOpen = hour >= openHour && hour <= closeHour;

  if (!isOpen)
  {
    return (
      <p>
        We're happy to welcome you between {openHour}:00 and {closeHour}:00
      </p>
    );
  }

 return (
  <footer className='footer'>
      <div className='order'>
        <p>We're open until {closeHour}:00. Come visit us or order online</p>
        <button className='btn'>Order</button>
      </div>
  </footer>
 )
}

function Pizza({name, ingrediants, photoName, price, soldOut}) {
  return (
    <li className={`pizza ${soldOut == true ? "sold-out" : ""}`}>
      <img src={`/pizzas/${photoName}`}></img>
      <div>
        <h3>{name}</h3>
        <p>{ingrediants}</p>
        <span>{soldOut == true ? "SOLD OUT" : price}</span>
      </div>
    </li>
  )
}

export default App
