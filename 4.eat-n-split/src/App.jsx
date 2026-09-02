import { useState } from 'react'
import './App.css'


function App() {

  const [friends, setFriends] = useState(
    [
      {
        id: 118836,
        name: "Clark",
        image: "https://i.pravatar.cc/48?u=118836",
        balance: -7,
      },
      {
        id: 933372,
        name: "Sarah",
        image: "https://i.pravatar.cc/48?u=933372",
        balance: 20,
      },
      {
        id: 499476,
        name: "Anthony",
        image: "https://i.pravatar.cc/48?u=499476",
        balance: 0,
      },
    ]
  );

  const [openAddFriend, setOpenAddFriend] = useState(false);

  const[selectedFriend, setSelectedFriend] = useState(118836);

  
  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList 
          friends={friends} 
          setFriends={setFriends}
          selectedFriend={selectedFriend}
          setSelectedFriend={setSelectedFriend}
          >
        </FriendsList>

        {openAddFriend &&
        <>
          <FormAddFriend friends={friends} setFriends={setFriends}>
          </FormAddFriend>

          <Button onClick={() => setOpenAddFriend(false)}>
           Close
          </Button>
        </>
        }

        {
          !openAddFriend &&
          <Button onClick={() => setOpenAddFriend(true)}>
            Add friend
          </Button>
        }

      </div>

      <FormSplitBill 
        friends={friends} 
        setFriends={setFriends}
        selectedFriend={selectedFriend}
        >
      </FormSplitBill>
    </div>
  )
}

export default App

function FriendsList({friends, setFriends, selectedFriend, setSelectedFriend}){
  return <ul>
    {friends.map(friend => 
      <Friend 
        key={friend.id} 
        friend={friend}
        selectedFriend={selectedFriend}
        setSelectedFriend={setSelectedFriend}>

      </Friend>
    )}
  </ul>
}

function Friend({friend, selectedFriend, setSelectedFriend}){
  return (
    <li>
      <img src={friend.image}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className='red'> You owe {friend.name} {Math.abs(friend.balance)}€</p>}
      {friend.balance > 0 && <p className='green'> {friend.name} owes you {Math.abs(friend.balance)}€</p>}
      {friend.balance == 0 && <p> you and {friend.name} are even</p>}
      <Button onClick={() => setSelectedFriend(friend.id)}>Select</Button>
    </li>
  );
}

function Button({children, onClick, type = "button"}){
  return <button type={type} className='button' onClick={onClick}>{children}</button>;
}

function FormAddFriend({friends, setFriends}) {
  const [name, setName] = useState();
  const [img, setImg] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    const id = friends.length + 1;

    setFriends([...friends, {
      id: id,
      name: name,
      image: img + `?u=${id}`,
      balance: 0,
    }]);

    setName('');
    setImg('');
  }

  return <form className='form-add-friend' onSubmit={handleSubmit}>
    <label>🧑‍🤝‍🧑name</label>
    <input type="text" value={name} onChange={(e) => setName(e.target.value)}></input>

    <label>🧑‍🤝‍🧑image URL</label>
    <input type="text" value={img} onChange={(e) => setImg(e.target.value)}></input>

    <Button type="submit">
      Add
    </Button>
  </form>
}

function FormSplitBill({friends, setFriends, selectedFriend}){
  const selectedFriendObj = friends.find(friend => friend.id == selectedFriend);

  const [bill, setBill] = useState(0);
  const [myExpense, setMyExpense] = useState(0);
  const [payingUser, setPayingUser] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();

    let userNewBalance = Number(bill) - Number(myExpense);
    if (payingUser == 1)
    {
      userNewBalance = -Number(myExpense);
    }

    setFriends(() => friends.map(f => 
      f.id == selectedFriend ? {...f, balance: userNewBalance}
      : f
    ))
  };

  return <form className='form-split-bill' onSubmit={handleSubmit}>
    <h2>Split a bill with {selectedFriendObj.name}</h2>

    <label>💰Bill value</label>
    <input type="text" value={bill} onChange={(e) => setBill(e.target.value)}></input>

    <label>🙍Your expense</label>
    <input type="text" value={myExpense} onChange={(e) => setMyExpense(e.target.value)}></input>

    <label>🧑‍🤝‍🧑{selectedFriendObj.name} expense</label>
    <input type="text" disabled value={Number(bill) - Number(myExpense)}></input>

    <label>🤑Who is paying the bill?</label>
    <select value={payingUser} onChange={(e) => setPayingUser(e.target.value)}>
      <option value='0'>You</option>
      <option value='1'>{selectedFriendObj.name}</option>
    </select>

    <Button type="submit">Split Bill</Button>
  </form>
}