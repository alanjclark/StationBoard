import { getDepartures } from '../darwin.service';
import axios from 'axios';
import type { TrainService } from '../../types/darwin';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Darwin Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RDM_API_KEY = 'test-key';
    process.env.RDM_API_BASE_URL = 'https://api.test.com';
  });

  describe('getDepartures', () => {
    it('should fetch and transform departure data', async () => {
      const mockResponse = {
        data: {
          locationName: 'Euston',
          trainServices: [
            {
              serviceID: '12345',
              std: '12:34',
              etd: '12:36',
              platform: '5',
              operator: 'Avanti West Coast',
              operatorCode: 'VT',
              origin: [{ crs: 'EUS', locationName: 'London Euston' }],
              destination: [{ crs: 'BHM', locationName: 'Birmingham New Street' }],
              isCancelled: false,
              serviceType: 'train',
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getDepartures('EUS');

      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        serviceID: '12345',
        std: '12:34',
        etd: '12:36',
        platform: '5',
        operator: 'Avanti West Coast',
        operatorCode: 'VT',
        locationName: 'Euston',
        isCancelled: false,
        serviceType: 'train',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.test.com/GetDepartureBoard/EUS',
        {
          params: { numRows: 15 },
          headers: { 'x-apikey': 'test-key' },
        }
      );
    });

    it('should handle empty train services', async () => {
      const mockResponse = {
        data: {
          locationName: 'Euston',
          trainServices: [],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getDepartures('EUS');

      expect(result).toEqual([]);
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      const result = await getDepartures('EUS');

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });

    it('should return empty array when API key is not configured', async () => {
      delete process.env.RDM_API_KEY;

      const result = await getDepartures('EUS');

      expect(result).toEqual([]);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should extract calling points when available', async () => {
      const mockResponse = {
        data: {
          locationName: 'Euston',
          trainServices: [
            {
              serviceID: '12345',
              std: '12:34',
              subsequentCallingPoints: [
                {
                  callingPoint: [
                    { locationName: 'Watford Junction', crs: 'WFJ', st: '12:45', et: '12:47' },
                    { locationName: 'Milton Keynes', crs: 'MKC', st: '13:00' },
                  ],
                },
              ],
            },
          ],
        },
      };

      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await getDepartures('EUS');

      expect(result[0].subsequentCallingPoints).toHaveLength(1);
      expect(result[0].subsequentCallingPoints?.[0]).toHaveLength(2);
      expect(result[0].subsequentCallingPoints?.[0][0]).toMatchObject({
        locationName: 'Watford Junction',
        crs: 'WFJ',
        st: '12:45',
        et: '12:47',
      });
    });
  });
});


