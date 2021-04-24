using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Zero.EventBus.Events;

namespace Zero.Eventlog
{
    public interface IEventLogService
    {
        Task<IEnumerable<EventLogEntry>> RetrieveEventLogsPendingToPublishAsync();
        void MarkEventAsPublishedAsync(Guid eventId);
        void MarkEventAsInProgressAsync(Guid eventId);
        void MarkEventAsFailedAsync(Guid eventId);
        void CreateEventLogAsync(IntegrationEvent @event);
    }
}