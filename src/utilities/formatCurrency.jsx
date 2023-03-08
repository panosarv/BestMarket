const CURRENCY_FORMATTER = new Intl.NumberFormat(undefined, {
    currency: "EUR",style:"currency"
})

function formatCurrency(price){
    return CURRENCY_FORMATTER.format(price)
}