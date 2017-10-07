import State from '../index';

describe('State', () => {

  it('should get some value', () => {
    State.state = {
      Motherbase: {
        where: 'Offshore plant',
      },
    };
    expect(State.get('Motherbase')).toEqual({
      where: 'Offshore plant',
    });
  });

  it('should set some key/value pair', () => {
    State.state = {};
    State.set('Key', {
      value: 'Yep this is some value',
    });
    expect(State.state).toEqual({
      Key: {
        value: 'Yep this is some value',
      },
    });
  });

  it('should set the state', () => {
    State.state = {};
    State.setState({
      Motherbase: {
        where: 'Offshore plant',
      },
      Key: {
        value: 'Yep this is some value',
      },
    });
    expect(State.state).toEqual({
      Motherbase: {
        where: 'Offshore plant',
      },
      Key: {
        value: 'Yep this is some value',
      },
    });
  });

  describe('when setting some key/value pair', () => {
    it('should fire all registered listeners', () => {
      State.setState({});
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      State.addListener(listener1);
      State.addListener(listener2);
      State.set('Key', {
        value: 'Yep this is some value',
      });
      expect(listener1).toBeCalled();
      expect(listener2).toBeCalledWith(State.state);
    });
  });

});
