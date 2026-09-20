import { fireEvent, render } from '@testing-library/react-native';

import { Button } from '@/components/button';

describe('Button', () => {
  it('dispara a ação quando habilitado', () => {
    const onPress = jest.fn();
    const screen = render(<Button onPress={onPress}>Continuar</Button>);
    fireEvent.press(screen.getByRole('button', { name: 'Continuar' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('não dispara a ação durante loading', () => {
    const onPress = jest.fn();
    const screen = render(<Button onPress={onPress} loading accessibilityLabel="Salvando">Continuar</Button>);
    fireEvent.press(screen.getByRole('button', { name: 'Salvando' }));
    expect(onPress).not.toHaveBeenCalled();
  });
});
