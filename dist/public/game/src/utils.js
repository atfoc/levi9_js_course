function showHideUi(ui, toShow)
{

    for(var key of Object.keys(ui))
    {
        if(ui[key].classList !== undefined && ui[key].classList.add !== undefined)
        {
            if(toShow.find(function (el) {return el === key;}) !== undefined)
            {
                showElements([ui[key]]);
            }
            else
            {
                hideElements([ui[key]]);
            }
        }
    }
}

function showElements(elements)
{
    const classToAddOrRemove = 'd-none';
    for(let el of elements)
    {
        if(el !== undefined && el !== null && el.classList !== undefined)
        {
            el.classList.remove(classToAddOrRemove);
        }
    }
}

function hideElements(elements)
{
    const classToAddOrRemove = 'd-none';
    for(let el of elements)
    {
        if(el !== undefined && el !== null && el.classList !== undefined)
        {
            el.classList.add(classToAddOrRemove);
        }
    }
}

function removeAllClickListeners(ui)
{
    for(var key of Object.keys(ui))
    {
        if(ui[key].onclick !== undefined)
        {
            ui[key].onclick = null;
        }
        else if(ui[key] instanceof Array)
        {
            removeAllClickListeners(ui[key]);
        }
    }
}