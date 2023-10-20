<link rel="preconnect" href="https://fonts.gstatic.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">

<p align="center">
  <img src="https://res.cloudinary.com/deo9hwbhx/image/upload/v1697318940/aqutnnkbsxc6ij3ixs2t.png" alt="Logo-de-tauro">
</p>

<p align="center">Una interfaz de línea de comandos (@tauro/cli) progresivo para crear aplicaciones del lado del servidor y del lado del cliente eficientes y escalables.</p>
<p align="center">
<a href="#"><img src="https://res.cloudinary.com/deo9hwbhx/image/upload/v1697423526/dtsh0kckzf7vbh7cop0q.svg" alt="NPM Version" /></a>
<a href="#"><img src="https://res.cloudinary.com/deo9hwbhx/image/upload/v1697418438/datkjlatwox4ksfmltmn.svg" alt="Package License" /></a>
<a href="https://discord.gg/ZVGrnH56" target="blank"><img src="https://res.cloudinary.com/deo9hwbhx/image/upload/v1697418438/soyh1lyi3md2vl3dxqqt.svg" alt="NPM Downloads" /></a>
<a href="https://github.com/TauroDev/tauro-cli" target="blank"><img src="https://res.cloudinary.com/deo9hwbhx/image/upload/v1697418438/gbuac3yckgtudgausvfh.svg" alt="Colaborative repo" /></a>
</p>

# @Tauro/cli - Herramienta para Desarrollo de Aplicaciones Frontend y Backend

Tauro CLI es una potente herramienta de línea de comandos diseñada para facilitar el desarrollo de aplicaciones front-end y back-end de alta calidad. Este conjunto de herramientas avanzadas está centrado en permitir la creación de aplicaciones de React.js en el lado del cliente y aplicaciones basadas en Express y TypeScript en el lado del servidor, utilizando enfoques de arquitectura modular y escalable.

## Características Destacadas:

- **Desarrollo Frontend con React.js:** Tauro CLI simplifica la creación de aplicaciones front-end basadas en React.js. Ofrece plantillas y estructuras de proyectos listas para usar, lo que permite un rápido inicio y un desarrollo eficiente.

- **Arquitectura Modular y Escalable:** El CLI está diseñado para promover la construcción de aplicaciones con una arquitectura modular que permite la fácil expansión y mantenimiento a medida que tu proyecto crece.

- **Desarrollo Backend con Express y TypeScript:** Con Tauro CLI, puedes generar aplicaciones back-end sólidas basadas en Express y TypeScript. Esto permite construir servidores robustos con una base sólida de código.

- **Inyección de Dependencias y Arquitectura Hexagonal:** Tauro CLI promueve el uso de inyección de dependencias y la arquitectura hexagonal para mejorar la organización y la escalabilidad de las aplicaciones backend.

- **Productividad Mejorada:** Automatiza tareas comunes como la generación de componentes, rutas, controladores y más, lo que agiliza el desarrollo y reduce el tiempo de implementación.

- **Configuración Personalizable:** Tauro CLI permite la personalización de configuraciones para adaptarse a las necesidades específicas de tu proyecto.

## Instalación

```
$ npm install -g @tauro/cli
```

## Comando base

```
$ tauro
```

## Banderas permitidas para utilizar

| Comando base | Bandera                   | Descripción                                                                                 |
| ------------ | ------------------------- | ------------------------------------------------------------------------------------------- |
| tauro        | start, s                  | Inicializa el cli donde nos pregunta que aplicación queremos instanciar, si es front o back |
| tauro        | v, version, -v, --version | Nos muestra la versión más reciente del cli                                                 |

## Demo de uso

```
$ tauro start
```

Iniciará el cli mostrandonos los siguientes valores

```
$ Qué tipo de aplicación vas a crear?
    > front-end-app
      back-end-app
```

```
$ Qué tipo de aplicación vas a crear?
    > React js
      Next js (En Desarrollo)
      Vue js (En Desarrollo)
      Vanilla js (En Desarrollo)
```

Una vez seleccionado el framework empezará a descargar los templates del repositorio <a href="https://github.com/TauroDev/base-front-end.git" target="blank">TauroDev/base-front-app</a> o si es back (por el momento no disponible aun) TauroDev/base-back-app

Una vez descargue los templates nos monstrara las versiones de disponibles de las arquitecturas.

Nota: Falta la optimización y explicación de que contiene cada versión estamos trabajando en ello,

```
$ Qué tipo de versión desea usar?
    > v1
      v2
      v3
      v4
```

Una vez selecciones la version te pedira el nombre del proyecto,

```
$ Ingrese nombre del proyecto (tauro-app): 
```

Este nombre se insertará automaticamente en el package.json de la app


## Futuras Features

- Vas a poder seleccionar si quieres utilizar frameworks css como: Bootstrap y tailwind css
- Vas a poder seleccionar si quieres trabajar con css custom o con pre procesadores
- Agregaremos soporte para Next js y Vanilla js