import React, { useState } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '../../stores/context'
import reactLogo from '../../assets/images/react.svg'
import viteLogo from '/vite.svg'
import './Home.scss'



export default observer(function () {
    const { appStore } = useStores();

    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React 1</h1>
            <h2>Title: {appStore.config.title}</h2>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
                <p>
                    <a href='/about'>About Me</a>
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
})
