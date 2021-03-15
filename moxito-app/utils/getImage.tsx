
export const getImage = (index: string) => {
    switch (index) {
      case '0':
        return require('../assets/motos/moto-1.png');
      
      case '1':
        return require('../assets/motos/moto-2.png');
 
      case '2':
        return require('../assets/motos/moto-3.png');

      case '3':
        return require('../assets/motos/moto-4.png');

      default:
        return require('../assets/motos/moto-1.png');
        
    }
  };