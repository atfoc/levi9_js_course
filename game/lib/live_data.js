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
 *     setData(data: (T | null) | ((Wrapper<T| null>)=>void)): void
 *     getData(): T | null
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

    this.mWrapedData = wrapper;
    this.mObservers = [];
    this.mBlockedNotifications = false;
}

/**
 * This function is used to notify all observers that data is changed.
 * There is no need to use this because set_data does it internally.
 */
LiveData.prototype.notify = function ()
{
    for(var observer of this.mObservers)
    {
        if(!this.mBlockedNotifications)
        {
            observer(this.mWrapedData.data);
        }
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

    this.mObservers.push(observer);
};

/**
 *  Setter can be function or value of type T | null
 *  Function is used to change object in place and it accept wrapper<T|null> because you can change
 *  then state in place using old value or just setting a new value.
 *  This function also accept the value of type T | null because only easier syntax  when you don't need previous value
 *  to update the data
 */
LiveData.prototype.setData = function (setter)
{
    if(typeof(setter) === 'function')
    {
        setter(this.mWrapedData)
    }
    else if(setter === undefined)
    {
        this.mWrapedData.data = null;
    }
    else
    {
        this.mWrapedData.data = setter;
    }

    this.notify();
};


/**
 *
 * This data is used to return data to user
 */
LiveData.prototype.getData = function ()
{
    return this.mWrapedData.data;
};

LiveData.prototype.blockNotifications = function (value)
{
    if(value !== null && value !== undefined)
    {
        this.mBlockedNotifications = value;
    }
};


function ImmutableLiveData(liveData)
{
    if(liveData !== undefined)
    {
        this.mData = liveData;
    }
    else
    {
        this.mData = null;
    }
}

ImmutableLiveData.prototype.getData = function ()
{
    if(this.mData !== null)
    {
        return this.mData.getData();
    }
    else
    {
        return null;
    }

};

ImmutableLiveData.prototype.observe = function (observer)
{
    if(this.mData !== null)
    {
        this.mData.observe(observer);
    }
};
