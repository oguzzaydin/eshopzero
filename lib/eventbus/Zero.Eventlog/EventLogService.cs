using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Zero.EventBus.Events;

namespace Zero.Eventlog
{
    public class EventLogService : IEventLogService
    {
        private readonly EventLogContext _context;
        private readonly List<Type> _eventTypes;

        public EventLogService(EventLogContext context)
        {
            _context = context;
            _eventTypes = Assembly.Load(Assembly.GetEntryAssembly()?.FullName)
                .GetTypes()
                .Where(t => t.Name.EndsWith(nameof(IntegrationEvent)))
                .ToList();
        }

        public async Task<IEnumerable<EventLogEntry>> RetrieveEventLogsPendingToPublishAsync()
        {
            var result = await _context.IntegrationEventLogs
                .Where(e => e.State == EventState.NotPublished).ToListAsync();

            if (result != null && result.Any())
            {
                return result.OrderBy(o => o.CreationTime)
                    .Select(e => e.DeserializeJsonContent(_eventTypes.Find(t => t.Name == e.EventTypeShortName)));
            }

            return new List<EventLogEntry>();
        }

        public void CreateEventLogAsync(IntegrationEvent @event)
        {
            _context.IntegrationEventLogs.Add(new EventLogEntry(@event));
            _context.SaveChanges();
        }

        public void MarkEventAsPublishedAsync(Guid eventId)
        {
            UpdateEventStatus(eventId, EventState.Published);
        }

        public void MarkEventAsInProgressAsync(Guid eventId)
        {
            UpdateEventStatus(eventId, EventState.InProgress);
        }

        public void MarkEventAsFailedAsync(Guid eventId)
        {
            UpdateEventStatus(eventId, EventState.PublishedFailed);
        }

        private void UpdateEventStatus(Guid eventId, EventState status)
        {
            var eventLogEntry = _context.IntegrationEventLogs.Single(ie => ie.EventId == eventId);
            eventLogEntry.State = status;

            if (status == EventState.InProgress)
                eventLogEntry.TimesSent++;

            _context.IntegrationEventLogs.Update(eventLogEntry);
            _context.SaveChanges();
        }
    }
}