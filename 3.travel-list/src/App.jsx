import { useState } from 'react'
import './App.css'

const initialItems = [
  { id: 1, description: "Passports", quantity: 2, packed: false },
  { id: 2, description: "Socks", quantity: 12, packed: false },
  { id: 3, description: "Charger", quantity: 12, packed: true },
];

function App() {

  const [items, setItems] = useState(initialItems);

  return (
    <div className='app'>
      <Logo></Logo>

      <Form items={items} setItems={setItems}></Form>

      <PackingList items={items} setItems={setItems}></PackingList>

      <Stats items={items}></Stats>
    </div>
  )
}

export default App

function Logo()
{
  return (
    <h1>
      🌴 Far Aways 💼
    </h1>
  )
}

function Form({items, setItems})
{
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();

    const item = { 
      id: items.length + 1, 
      description: description, 
      quantity: quantity, 
      packed: false };

    setItems([...items, item]);

    //at the end return to form initial value
    setDescription("");
    setQuantity(1);
  };

  return (
    <form className='add-form' onSubmit={handleSubmit}>
      <h3>What do you need for your ❤️ trip?</h3>

    <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
      {Array.from({ length: 3 }, (_, i) => i + 1).map((num) => (
        <option value={num} key={num}>
          {num}
        </option>
      ))}
    </select>

      <input 
        value = {description} 
        type="text" 
        placeholder='Item...' 
        onChange={(e) => setDescription(e.target.value)}>
      </input>

      <button>Add</button>
    </form>
  )
}

function PackingList({items, setItems})
{
  const [action, setAction] = useState('input');

  let sortedItems = items;

  if (action == 'description')
  {
    sortedItems = items.toSorted((a, b) => a.description.localeCompare(b.description));
  }
  else if (action == 'packed')
  {
    sortedItems = items.toSorted((a, b) => Number(b.packed) - Number(a.packed));
  }

  return (
    <div className='list'>
      <ul>
        {
          sortedItems.map(i => {
            return <Item item={i} key={i.id} items={items} setItems={setItems}></Item>
          })
        }
      </ul>

      <div className='actions'>
        <select onChange={(e) => setAction(e.target.value)}>
          <option value='input'>Sort by input order</option>
          <option value='description'>Sort by description</option>
          <option value='packed'>Sort by packed status</option>
        </select>

        <button onClick={() => setItems([])}>Clear list</button>
      </div>
    </div>
  )
}

function Item({item, items, setItems})
{
  return (
    <li>
      <input 
        type="checkbox" 
        checked={item.packed}
        onChange={(e) => setItems(items.map(
          i => {
            if (i.id == item.id) return {...item, packed: e.target.checked};
            return i;
          }
        ))}>
      </input>

      <span style={item.packed == true ? {textDecoration: "line-through"} : {}}>
        {item.quantity} {item.description}
      </span>

      <button onClick={() => setItems(items.filter(i => i.id != item.id))}>
        ❌
      </button>
    </li>
  )
}

function Stats({items})
{
  const packedLength = items.filter(item => item.packed).length;

  const packedPercentage = ((packedLength / items.length) * 100).toFixed(2);

  return (
    <footer className='stats'>
     <em> 💼 You have {items.length} items on your list, and you already packed {packedLength} ({packedPercentage}%)</em>
    </footer>
  )
}