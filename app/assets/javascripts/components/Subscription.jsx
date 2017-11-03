var Subscription = React.createClass({
  getInitialState: function(){
    return {
      validShippingAddress: false,
      customer: this.props.customer,
      initialShipping: true,
      shippingError: '',
      address: {
        first_name: this.props.customer.first_name || '',
        last_name: this.props.customer.last_name || '',
        address: this.props.customer.address || '',
        Address2: this.props.customer.Address2 || '',
        city: this.props.customer.city || '',
        state: this.props.customer.state || '',
        zip_code: this.props.customer.zip_code || '',
      },
      cartedSubscriptions: this.props.carted_subscriptions,
    }
  },
  componentWillMount: function() {
    this.setState({
      shipping: this.state.initialShipping,
      address: this.state.address,
      shippingError: this.state.shippingError,
      cartedSubscriptions: this.state.cartedSubscriptions
    })
  },
  updateAddress: function() {
    var obj = {};
    obj = this.state.address;
    var that = this;
    $.ajax({
      type: "PATCH",
      url: "/api/customers/" + this.state.customer.id + '?subscription=true', 
      contentType: "application/json",
      dataType: "json", 
      data: JSON.stringify(obj),
      error: function(error){
        console.log(error);
        Materialize.toast('Shipping Information is Incomplete', 4000);
        that.setState({shippingError: 'inputError'});
      },
      success: function(response){
        console.log(response);
        that.setState({
          address: {
            first_name: response.customer.first_name,
            last_name: response.customer.last_name,
            address: response.customer.address,
            Address2: response.customer.Address2,
            city: response.customer.city,
            state: response.customer.state,
            zip_code: response.customer.zip_code,
          },
          validShippingAddress: response.valid_shipping_address,
          shippingError: response.valid_shipping_address ? '' : 'inputError'
        });
        if (response.valid_shipping_address) {
          Materialize.toast('Shipping Information Saved and Validated', 4000);
        } else {
          Materialize.toast('Shipping Information Saved but NOT Validated', 4000);
        }
      }
    })
  },
  render: function() {  
    var divStyle = {
      marginTop: '.5cm',
    };
    return (
      <div className="row">
        <div className="col s5">
          <Address shipping={this.state.shipping}
                     address={this.state.address}
                     validate={this.state.shippingError}
                     handleChange={this}
                     update={this.updateAddress} />
        </div>
        
        <div className="col s5 test">
          <div className="Checkout">
            <div className="OrderSummary">
              <div className="Title">Plan Summary</div>
              <table>
                {this.state.cartedSubscriptions.map((sub, i) => {
                  return (
                    <tr key={i}>
                      Plan: {sub.plan_id}, Price {(sub.amount * 0.01).toLocaleString("en-US", {style: "currency", currency: "USD", minimumFractionDigits:2})} <div style={divStyle}></div>
                    </tr>
                    )
                  })
                }
              </table>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
