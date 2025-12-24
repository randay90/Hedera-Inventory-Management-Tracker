// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;

library HederaResponseCodes {
    int internal constant SUCCESS = 22;
    int internal constant FAIL_INVALID = 24;
    int internal constant FAIL_FEE = 25;
    int internal constant FAIL_BALANCE = 26;
}
