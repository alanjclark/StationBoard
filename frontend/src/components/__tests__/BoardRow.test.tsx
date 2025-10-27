import { render, screen } from '@testing-library/react';
import BoardRow from '../BoardRow';
import type { TrainService } from '@/types/darwin';

describe('BoardRow', () => {
  const mockService: TrainService = {
    serviceID: '12345',
    std: '12:34',
    etd: undefined,
    platform: '5',
    operator: 'Avanti West Coast',
    operatorCode: 'VT',
    locationName: 'London Euston',
    origin: {
      location: {
        crs: 'EUS',
        description: 'London Euston',
      },
    },
    destination: [{
      location: {
        crs: 'BHM',
        description: 'Birmingham New Street',
      },
    }],
    isCancelled: false,
    isTerminating: false,
    serviceType: 'train',
  };

  it('displays scheduled time correctly', () => {
    render(<BoardRow service={mockService} />);
    expect(screen.getByText(/12:34/i)).toBeInTheDocument();
  });

  it('displays destination correctly', () => {
    render(<BoardRow service={mockService} />);
    expect(screen.getByText(/Birmingham New Street/i)).toBeInTheDocument();
  });

  it('displays platform information', () => {
    render(<BoardRow service={mockService} />);
    expect(screen.getByText(/5/i)).toBeInTheDocument();
  });

  it('shows ON TIME status when no delay', () => {
    render(<BoardRow service={mockService} />);
    expect(screen.getByText(/ON TIME/i)).toBeInTheDocument();
  });

  it('shows DELAYED status when expected time differs', () => {
    const delayedService = {
      ...mockService,
      etd: '12:45',
    };
    render(<BoardRow service={delayedService} />);
    expect(screen.getByText(/DELAYED/i)).toBeInTheDocument();
  });

  it('shows CANCELLED status for cancelled trains', () => {
    const cancelledService = {
      ...mockService,
      isCancelled: true,
    };
    render(<BoardRow service={cancelledService} />);
    expect(screen.getByText(/CANCELLED/i)).toBeInTheDocument();
  });

  it('displays expected time when delayed', () => {
    const delayedService = {
      ...mockService,
      std: '12:34',
      etd: '12:45',
    };
    render(<BoardRow service={delayedService} />);
    expect(screen.getByText(/12:45/i)).toBeInTheDocument();
  });

  it('truncates long destination names', () => {
    const longDestinationService = {
      ...mockService,
      destination: [{
        location: {
          crs: 'TEST',
          description: 'This is a very long station name that should be truncated to fit the display properly',
        },
      }],
    };
    render(<BoardRow service={longDestinationService} />);
    // Destination should still be displayed (first 58 chars)
    expect(screen.getByText(/This is a very long station name that should be truncated/i)).toBeInTheDocument();
  });
});


