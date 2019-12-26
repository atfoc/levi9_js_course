import React from 'react';
import './table.css';

export function Table(props)
{
    const numberOfColumns= props.data[0].length;

    const initValue = [];
    for(let i = 0; i < numberOfColumns; ++i) {
        initValue.push([]) ;
    }

    const columnsJSX= props.data.reduce((previousValue, currentDataRow) =>{
        if(currentDataRow.length !== numberOfColumns){
            throw new Error('All rows must have same number of columns')
        }

        currentDataRow.forEach((item, index)=>{
            previousValue[index].push(<div className='table-row'>{item}</div>)
        });

        return previousValue;
    }, initValue);

    const tableJSX = columnsJSX.map((column)=> {
        return <div className='table-col'>{column}</div>
    });

    return (
        <div style={{justifyContent: 'center', display:'flex', flexDirection: 'row'}}>
            {tableJSX}
        </div>
    )
}

