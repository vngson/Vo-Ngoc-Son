var sum_to_n_a = function(n) {
    let sum = 0;
    for(var i = 1; i <= n; i++){
        sum = sum + i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    let sum = 0;
    let i = 1;
    do {
        sum = sum + i;
        i++;
    } while (i <= n);
    return sum;
};

var sum_to_n_c = function(n) {
    let sum = 0;
    while (n > 0){
        sum = sum + n;
        n--;
    };
    return sum;
};

console.log(sum_to_n_a(5));
console.log(sum_to_n_b(5));
console.log(sum_to_n_c(5));