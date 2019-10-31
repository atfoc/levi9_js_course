function showHideUi(ui, toShow)
{
    var classToAddOrRemove = 'd-none';

    for(var key of Object.keys(ui))
    {
        if(ui[key].classList !== undefined && ui[key].classList.add !== undefined)
        {
            if(toShow.find(function (el) {return el === key;}) !== undefined)
            {
                ui[key].classList.remove(classToAddOrRemove);
            }
            else
            {
                ui[key].classList.add(classToAddOrRemove);
            }
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