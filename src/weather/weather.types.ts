export interface CurrentWeatherResponse {
  cod: number;
  message?: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  name: string;
  coord: {
    lon: number;
    lat: number;
  };
}
