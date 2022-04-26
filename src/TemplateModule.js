import React, { useState, useEffect } from 'react'
import { Form, Input, Grid, Card, Statistic } from 'semantic-ui-react'

import { useSubstrateState } from './substrate-lib'
import { TxButton } from './substrate-lib/components'

function Main() {
  const { api } = useSubstrateState()
  console.log(api.query)


  // // The transaction submission status
  const [status, setStatus] = useState('')

  // // The currently stored value
  const [currentValue, setCurrentValue] = useState(0)
  const [currentState, setCurrentState] = useState("")
  const [formValue, setFormValue] = useState(0)

  useEffect(() => {
    let unsubscribe
    api.query.templateModule
      .numberStorage(newValue => {
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        if (newValue.isNone) {
          setCurrentValue('<None>')
        } else {
          setCurrentValue(newValue.unwrap().toNumber())
        }
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

      api.query.templateModule
      .actionStorage(newValue => {
        // The storage value is an Option<u32>
        // So we have to check whether it is None first
        // There is also unwrapOr
        console.log(newValue.unwrap().toString(), String.fromCharCode(...newValue.unwrap()))
        if (newValue.isNone) {
          setCurrentState('<None>')
        } else {
          setCurrentState(String.fromCharCode(...newValue.unwrap()))
        }
      })
      .then(unsub => {
        unsubscribe = unsub
      })
      .catch(console.error)

    return () => unsubscribe && unsubscribe()
  }, [api.query.templateModule])

  return (
    <>
        <Grid.Column width={8}>
          <h1>Template Module</h1>
          <Card centered>
            <Card.Content textAlign="center">
              <Statistic label="Current Value" value={currentValue} />
            </Card.Content>
          </Card>
          <Form>
            <Form.Field>
              <Input
                label="New Value"
                state="newValue"
                type="number"
                onChange={(_, { value }) => setFormValue(value)}
              />
            </Form.Field>
            <Form.Field style={{ textAlign: 'center' }}>
              <TxButton
                label="Store Number"
                type="SIGNED-TX"
                setStatus={setStatus}
                attrs={{
                  palletRpc: 'templateModule',
                  callable: 'storeNumber',
                  inputParams: [formValue],
                  paramFields: [true],
                }}
              />
            </Form.Field>
          </Form>
        </Grid.Column>
        <Grid.Column width={8}>
          <h1>Template Module</h1>
            <Card centered>
              <Card.Content textAlign="center">
                <Statistic label="Current Action" size="small" value={currentState} />
              </Card.Content>
            </Card>
            <Form>
              <Form.Field>
                <Input
                  label="New Action"
                  state="newValue"
                  type="text"
                  onChange={(_, { value }) => setFormValue(value)}
                />
              </Form.Field>
              <Grid.Row style={{display: "flex", justifyContent: "space-around"}}>
                <Grid.Column>
                  <Form.Field style={{}}>
                    <TxButton
                      label="Change Action"
                      type="SIGNED-TX"
                      setStatus={setStatus}
                      attrs={{
                        palletRpc: 'templateModule',
                        callable: 'changeAction',
                        inputParams: [formValue],
                        paramFields: [true],
                      }}
                    />
                  </Form.Field>
                </Grid.Column>
                <Grid.Column>
                  <Form.Field style={{}}>
                    <TxButton
                      label="Execute Action"
                      type="SIGNED-TX"
                      setStatus={setStatus}
                      attrs={{
                        palletRpc: 'templateModule',
                        callable: 'executeAction',
                        inputParams: [formValue],
                        paramFields: [],
                      }}
                    />
                  </Form.Field>
                </Grid.Column>
              </Grid.Row>
            </Form>
          </Grid.Column>
          <div style={{ overflowWrap: 'break-word', textAlign: 'center' }}>{status}</div>
        </>
  )
}

export default function TemplateModule(props) {
  const { api } = useSubstrateState()
  // return (<Main {...props} />)
  return api.query.templateModule && api.query.templateModule.numberStorage ? (
    <Main {...props} />
  ) : null
}
