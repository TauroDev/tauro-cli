import prettier from "prettier";

export const GenericPage = async (name: string) => {
  const contentFile = `
    import React from 'react'
    import styles from "./${name}.style.module.css"
    import ${name}ViewModel from "./${name}.viewmodel"

    const ${name} = () => {
        const {Increment, count} = ${name}ViewModel()
        return (
            <div className={styles.content}>
                <h1>Página ${name} creada por @tauro/cli</h1>
                <button className={styles.button} onClick={Increment}>Número actual: {count}</button>
            </div>
        )
    }

    export default ${name}
`;
  const formattedCode = await prettier.format(contentFile, {
    parser: "babel",
  });
  return formattedCode;
};

export const GenericPageStyle = async () => {
  const contentFile = `
    .content {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .button {
      padding: 10px 20px;
      font-size: 16px;
      font-weight: light; 
      color: #eceff4; 
      background: #1b1b1b; 
      border: none; 
      border-radius: 25px;
      cursor: pointer;
      outline: none;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s, box-shadow 0.3s, transform 0.3s;
    }
    
    .button:hover {
      background: #353535;
      box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
      transform: translateY(-2px);
    }
    
    .button:active {
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      transform: translateY(1px);
    }
`;
  const formattedCode = await prettier.format(contentFile, {
    parser: "css",
  });
  return formattedCode;
};

export const GenericPageViewModel = async (name: string) => {
  const contentFile = `
    import { useState } from "react";

    const ${name}ViewModel = () => {
        const [count, setCount] = useState(0)

        const Increment = () => {
            setCount(count + 1)
        }

        return {
            Increment,
            count
        }
    }

    export default ${name}ViewModel
`;
  const formattedCode = await prettier.format(contentFile, {
    parser: "babel",
  });
  return formattedCode;
};