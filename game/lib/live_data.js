/**
 *
 * @description Observer pattern. Used in state so that ui can update on changes
 * @param data: T | null - this data stored in Observer
 * @constructor
 *
 * typescript signature:
 * class LiveData<T>(data: T | null)
 * {
 *     notify(): void
 *     observe(observer: ((data: T | null)=>void))
 *     set_data(data: (T | null) | ((Wrapper<T| null>)=>void)): void
 *     get_data(): T | null
 * }
 *
 */
function LiveData(data)
{
    var wrapper = {data: null};

    if(data !== undefined)
    {
        wrapper.data = data;
    }

    this.m_wraped_data = wrapper;
    this.m_observers = [];
}

/**
 * This function is used to notify all observers that data is changed.
 * There is no need to use this because set_data does it internally.
 */
LiveData.prototype.notify = function ()
{
    for(var observer of this.m_observers)
    {
        observer(this.m_wraped_data.data);
    }
};

/**
 *
 * This function is used to subscribe new observer.
 * TODO: return proxy object used to disconnect observer
 */
LiveData.prototype.observe = function (observer)
{

    if(observer === undefined || observer === null || typeof(observer) !== 'function')
    {
        return;
    }

    this.m_observers.push(observer);
};

/**
 *  Setter can be function or value of type T | null
 *  Function is used to change object in place and it accept wrapper<T|null> because you can change
 *  then state in place using old value or just setting a new value.
 *  This function also accept the value of type T | null because only easier syntax  when you don't need previous value
 *  to update the data
 */
LiveData.prototype.set_data = function (setter)
{
    if(typeof(setter) === 'function')
    {
        setter(this.m_wraped_data)
    }
    else if(setter === undefined)
    {
        this.m_wraped_data.data = null;
    }
    else
    {
        this.m_wraped_data.data = setter;
    }
};


/**
 *
 * This data is used to return data to user
 */
LiveData.prototype.get_data = function ()
{
    return this.m_wraped_data.data;
};
