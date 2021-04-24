using System;
using Zero.EventBus.Events;

namespace Zero.EventBus.Abstractions
{
    public interface INotify
    {
        event EventHandler<IntegrationEvent> Started;
        event EventHandler<IntegrationEvent> Published;
    }
}