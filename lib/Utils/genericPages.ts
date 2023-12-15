import prettier from "prettier";

export const GenericPage = async (name: string) => {
  const contentFile = `
    import React from 'react'
    import styles from "./${name}style.module.css"
    import ${name}ViewModel from "./${name}.viewmodel"

    const ${name} = () => {
        const {Increment, count} = ${name}ViewModel()
        return (
            <div className={styles.content}>
                <h1>Página ${name} creada por @tauro/cli</h1>
                <button onClick={Increment}>Número actual: {count}</button>
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