function ControllerContainer()
{
    this.mWrappedController = {controller: null, changeController: this.changeController.bind(this)};
    this.mObservers = [];
}

ControllerContainer.prototype.changeController =  function(controller)
{
    /**
     * If someone kept the reference to controller wrapper for instance some function that captures the scope
     * this we protect  accidental change of controller. Still if some one keeps the reference to controller we can't
     * help a lot but that should not be done
     * */
    if(this.mWrappedController.controller !== null)
    {
        this.mWrappedController.controller.tearDown();
    }

    this.mWrappedController.controller = null;
    this.mWrappedController.changeController = null;

    if(controller === undefined || controller === null)
    {
        this.mWrappedController = {controller: null, changeController: null};
    }
    else
    {
        this.mWrappedController = {controller: controller, changeController: this.changeController.bind(this)};
    }

    this.notify();
};

ControllerContainer.prototype.getController = function ()
{
    return this.mWrappedController;
};

ControllerContainer.prototype.observe = function (observer)
{
    if(observer === undefined || observer === null  || typeof(observer) !== 'function')
    {
        return;
    }

    this.mObservers.push(observer);
};

ControllerContainer.prototype.notify = function ()
{
    for(var observer of this.mObservers)
    {
        observer(this.mWrappedController);
    }
};
