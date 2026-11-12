@extends('errors.layout')

@section('title', 'Too Many Requests')
@section('code', '429')
@section('heading', "Slow down a little")
@section('message', "You've sent a lot of requests in a short time. Please wait a minute and try again.")
