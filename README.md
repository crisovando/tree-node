# Api Taxonomía
Api rest que controla la administración de las especies segun su dominio taxonomico.
Se utiliza una estructura de arbol general modelo hijo izquierdo hermano derecho.

<img height="120" width="120" src="http://cchandurkar.github.io/data-tree/icon/icon.png"/>

## Instalación:
`git clone https://github.com/crisovando/tree-node.git` <br/>
Entrar al directorio del proyecto <br/>
`$ npm install`<br /><br /> 
node index.js

## Requisitos
Debe tener corriendo localmente mongodb, configurado por default en localhost:27017

## Documentacion api
La documentación de la api se puede ver en localhost:5000/v1/docs para la config default

## Taxonomía

Ante la gran cantidad de especies existentes en el planeta, se hace imprescindible identificarlas con un nombre y clasificarlas en grupos que incluyan organismos semejantes entre sí. Éste es el objetivo de la taxonomía, la cual es una rama de la biología que se encarga de dar nombre y clasificar a los seres vivos.
Las categorías taxonómicas con las cuales se trabaja más comúnmente, especificadas de la más general a la más específica, son:
1. Dominio<br/>
2. Reino<br/>
3. Filo o Filum<br/>
4. Clase<br/>
5. Orden<br/>
6. Familia<br/>
7. Género<br/>

## Ejemplo
Un ejemplo de dominio taxonomico a enviar seria:<br /> “animal.cordado.mamífero.primate.homínido.homo.homo sapiens”
La api deployada se encuentra en https://etaxonomia.herokuapp.com/v1/docs
