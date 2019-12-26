import React, {useEffect, useState} from 'react';
import {isElementOfType} from "react-dom/test-utils";
import {Table} from "./Table";


export function HighScores(props)
{
    const [highscores, setHighScores] = useState(null);

    const url = (props.url !== null && props.url !== undefined) ? props.url : 'http://localhost:3000/highScores';
    useEffect(()=> {
        fetch(url)
            .then(response=>{
                return response.json();
            })
            .then(response => {
                const headers = ['Nickname', 'Score'];
                const tableBody = response.map((item)=>{
                    return [item.nickname, item.score];
                });

                setHighScores([headers, ...tableBody]);
            })
    }, [url]);

    if(highscores === null)
    {
        return <h1>Loading...</h1>;
    }
    else
    {
        return <Table data={highscores}/>
    }


    return <h1>Test</h1>
}