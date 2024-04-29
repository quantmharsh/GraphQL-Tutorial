import logo from './logo.svg';
import './App.css';
import {gql, useQuery} from "@apollo/client"
// write a query 
const  query = gql`
 query GetTodos{

      getTodos {
        title 
        completed
        userId
        user{
          name 
          email
          phone
        }
      }
     }`

function App() {
  const{data , loading}=useQuery(query)
  if(loading) return <h1> loading data ...</h1>
  return (
    <div>
      {JSON.stringify(data)}
    </div>
  );
}

export default App;
