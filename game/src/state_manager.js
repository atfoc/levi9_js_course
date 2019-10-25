/**
 *
 * class StateManager<T>
 * {
 *     constructor(state: T | null = null);
 *     setState(state: T | null): void;
 *     getState(): T | null;
 *     hasState(): bool;
 * }
 */

function StateManager(state)
{
    if(state === undefined)
    {
        this.m_state= null;
    }
    this.m_state = state;
}

StateManager.prototype.setState = function (state)
{
    if(state === undefined)
    {
        this.m_state = null;
    }

    this.m_state = state;
};

StateManager.prototype.getState = function ()
{
    return this.m_state;
};

StateManager.prototype.hasState = function ()
{
    return this.m_state !== null;
};