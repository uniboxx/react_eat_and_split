import { useState } from 'react';

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
];

function Button({ onClick, children }) {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  );
}

function App() {
  const [addFormIsOpen, setAddFormIsOpen] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowFormAddFriend() {
    setAddFormIsOpen(val => !val);
  }

  function handleSelection(friend) {
    setSelectedFriend(cur => (friend.id === cur?.id ? null : friend));
    setAddFormIsOpen(false);
  }

  function handleAddFriend(friend) {
    console.log(friend);
    setFriends(friends => [...friends, friend]);
    console.log(friends);
    setAddFormIsOpen(false);
  }
  function handleFriendBalance(value) {
    setFriends(friends =>
      friends.map(friend =>
        friend.id !== selectedFriend?.id
          ? friend
          : { ...friend, balance: friend.balance + value }
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendsList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />
        {addFormIsOpen && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowFormAddFriend}>
          {addFormIsOpen ? 'Close' : 'Add friend'}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onFriendBalance={handleFriendBalance}
        />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelection, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map(friend => (
        <Friend
          friend={friend}
          key={friend.id}
          selectedFriend={selectedFriend}
          onSelection={onSelection}
        />
      ))}
    </ul>
  );
}

function Friend({ onSelection, friend, selectedFriend }) {
  const isSelected = friend.id === selectedFriend?.id;
  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={`${friend.name} image`} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} {-friend.balance}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className='green'>
          {friend.name} owes you {friend.balance}€
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button onClick={onSelection.bind(null, friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  );
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48');

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = { id, name, image: `${image}?=${id}`, balance: 0 };

    console.log(newFriend);

    onAddFriend(newFriend);
    setName('');
    setImage('https://i.pravatar.cc/48');
  }
  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 Friend name</label>
      <input type='text' value={name} onChange={e => setName(e.target.value)} />

      <label>🖼️ Image URL</label>
      <input
        type='text'
        value={image}
        onChange={e => setImage(e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectedFriend, onFriendBalance }) {
  const [bill, setBill] = useState('');
  const [paidByUser, setPaidByUser] = useState('');
  const [whoIsPaying, setWhoIsPaying] = useState('user');

  const paidByFriend = bill && bill > paidByUser ? bill - paidByUser : '';
  console.log(paidByFriend);

  function handleSubmit(e) {
    e.preventDefault();
    if (!bill || !paidByUser) return;

    const value = whoIsPaying === 'user' ? paidByFriend : -paidByUser;
    onFriendBalance(value);
  }
  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰️ Bill value</label>
      <input
        type='text'
        value={bill}
        onChange={e => setBill(+e.target.value)}
      />

      <label>🕴️ Your expense</label>
      <input
        type='text'
        value={paidByUser}
        onChange={e =>
          setPaidByUser(+e.target.value > bill ? paidByUser : +e.target.value)
        }
      />

      <label>🧑‍🤝‍🧑 {selectedFriend.name}'s expense</label>
      <input type='text' disabled value={paidByFriend} />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={e => setWhoIsPaying(e.target.value)}>
        <option value='user'>You</option>
        <option value='friend'>{selectedFriend.name}</option>
      </select>

      <Button>Split bill</Button>
    </form>
  );
}

export default App;
