import React from 'react'
import { connect } from 'react-redux'
import { Dispatch, RootState } from '@/store/index'

const mapState = (state: RootState) => ({
  counter: state.counter
})

const mapDispatch = (dispatch: Dispatch) => ({
  inc: () => dispatch.counter.inc(1),
  dec: () => dispatch.counter.inc(-1)
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>
type Props = StateProps & DispatchProps

class Counter extends React.Component<Props> {
  render() {
    return (
      <>
        <div onClick={this.props.inc} className='py-2 text-center text-white rounded-sm bg-green-500 active:bg-green-300'>
          Click me - {this.props.counter}
        </div>
        {/* <Button onClick={this.props.dec}>dec-{this.props.counter}</Button> */}
      </>
    )
  }
}

export default connect(mapState, mapDispatch)(Counter)
