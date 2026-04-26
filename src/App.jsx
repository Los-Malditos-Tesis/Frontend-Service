import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import CustomButton from './components/generic/CustomButton'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
         <CustomButton
                action={() => alert("Button clicked!")}
                className="!p-2"
                as="button"
                type="button"
                disabled={false}
              >
                Buscar
              </CustomButton>
    </>
  )
}

export default App
