import * as React from 'react'
import { StyleSheet, View, ActivityIndicator, Alert, AsyncStorage } from 'react-native'
import { observable, computed } from 'mobx'
import { observer, inject } from 'mobx-react/native'
import PropTypes from 'prop-types'

import { layouts } from '../globalStyles'

const styles = StyleSheet.create({

})

// handle your auto log in logic here
@inject('authStore')
@observer
class AutoLogIn extends React.Component {
  @observable authStore = this.props.authStore;

  @observable navi = this.props.navigation;

  @computed
  get tokenKey () {
    return this.authStore.tokenKey
  }

  async componentDidMount () {
    await this.handleRenewToken()
  }

  /**
   * @description renew token
   * @memberof AutoLogIn
   */
  handleRenewToken = async () => {
    const token = await AsyncStorage.getItem(this.tokenKey)
    if (token) {
      this.authStore
        .handleRenewToken()
        .then(({ suc, msg }) => {
          if (suc) {
            this.handleToMainStack()
          } else {
            Alert.alert(
              'Error', msg || 'Failed to get necessary information.',
              [{ text: 'OK', onPress: () => {} }],
              { cancelable: false, onDismiss: () => {} }
            )
            this.handleToAuthLogIn()
          }
        })
    } else {
      this.handleToAuthLogIn()
    }
  }

  handleToMainStack = () => {
    this.navi.navigate('MainStack')
  }

  handleToAuthLogIn = () => {
    this.navi.navigate('AuthLogIn')
  }

  render () {
    return (
      <View style={layouts.container}>
        <ActivityIndicator />
      </View>
    )
  }
}

AutoLogIn.propTypes = {
  authStore: PropTypes.any,
  navigation: PropTypes.any
}

export default AutoLogIn
