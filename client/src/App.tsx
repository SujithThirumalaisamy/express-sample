import './App.css';
import { Providers } from './Providers';
import { zcAuth } from '@zcatalyst/auth-client';

function App() {
  const user = zcAuth.isUserAuthenticated()
  console.log({ user })
  if (!user) return <div>UnAuthenticated</div>
  return (
    <div className="App">
      <Providers>
        <Test />
      </Providers>
    </div>
  );
}

function Test() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      Authenticated
    </div >
  )
}

export default App;
