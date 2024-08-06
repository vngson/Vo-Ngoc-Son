# Messy React
## List of the computational inefficiencies and anti-patterns found:
- Filtering balances with `amount <= 0` and sorting them separately.
- Prices are included as a dependency but not used directly.
- Separate mapping for formatting balances and then creating rows.
- `lhs` and `rhs` in sorting reduce readability.
## Original Version
```tsx
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

	const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}

  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
		  const balancePriority = getPriority(balance.blockchain);
		  if (lhsPriority > -99) {
		     if (balance.amount <= 0) {
		       return true;
		     }
		  }
		  return false
		}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
			const leftPriority = getPriority(lhs.blockchain);
		  const rightPriority = getPriority(rhs.blockchain);
		  if (leftPriority > rightPriority) {
		    return -1;
		  } else if (rightPriority > leftPriority) {
		    return 1;
		  }
    });
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })

  return (
    <div {...rest}>
      {rows}
    </div>
  )
}
```
## Refactored Version
```tsx
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis': return 100;
    case 'Ethereum': return 50;
    case 'Arbitrum': return 30;
    case 'Zilliqa': return 20;
    case 'Neo': return 20;
    default: return -99;
  }
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => balance.amount > 0 && getPriority(balance.blockchain) > -99)
      .map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
          usdValue
        };
      })
      .sort((a: FormattedWalletBalance, b: FormattedWalletBalance) => {
        return getPriority(b.blockchain) - getPriority(a.blockchain);
      });
  }, [balances, prices]);

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => (
    <WalletRow 
      className={classes.row}
      key={index}
      amount={balance.amount}
      usdValue={balance.usdValue}
      formattedAmount={balance.formatted}
    />
  ));

  return (
    <div {...rest}>
      {rows}
    </div>
  );
}

export default WalletPage;
```
## Explanation of Improvements
- Filter and sort balances in one step.
- Use dependencies that directly affect the memoized function.
- Format balances and create rows in a single map.
- Use descriptive names in sorting for readability.
