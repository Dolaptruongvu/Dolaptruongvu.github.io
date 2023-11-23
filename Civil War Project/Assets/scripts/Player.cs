using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    public float movespeed = 5f;
    public float rollBoost = 2f;
    private float rollTime;
    public float RollTimeInterface;
    bool rollOnce = false;
    private Rigidbody2D rb;
    public Vector3 moveInput;
    public SpriteRenderer characterSR; // use for fixing the children class ( gun ) following the parent class about local scale
    private Animator characterAnimator;

    private void Start()
    {
        characterAnimator = characterSR.GetComponent<Animator>(); // get animator from child and save it to animator variable
    }

    private void Update()
    {
        
        moveInput.x = Input.GetAxis("Horizontal"); // catching moving value
        moveInput.y = Input.GetAxis("Vertical");
        transform.position += moveInput * movespeed * Time.deltaTime; // set transform

        characterAnimator.SetFloat("Speed", moveInput.magnitude); // associating speed with parameter of animator (unity)

        if(Input.GetKeyDown(KeyCode.Space) && rollTime <= 0){ // start roll
            characterAnimator.SetBool("Roll", true);
            movespeed += rollBoost;
            rollTime = RollTimeInterface;
            rollOnce = true;
        }

        if(rollTime <= 0 && rollOnce == true) // end roll
        {
            characterAnimator.SetBool("Roll", false);
            movespeed -= rollBoost;
            rollOnce = false;
        }
        else // if rollTime still >=0 ( mean that the character still roll )
        {
            rollTime -= Time.deltaTime; // Time.deltatime , the time of the loop
        }

        if(moveInput.x != 0) // if player moving
        {
            if(moveInput.x > 0) // if moving to the right
            {
                characterSR.transform.localScale = new Vector3((float)1, (float)1, 0); // showing in right side

            }
            else
            {
                characterSR.transform.localScale = new Vector3((float)-1, (float)1, 0); // showing in left side
            }
        }
    }
    private PlayerHealth playerHealth;
    public void TakeDamage(int damage)
    {
        playerHealth = GetComponent<PlayerHealth>();
        if (playerHealth != null)
        {
            playerHealth.TakeDamage(damage);
        }
        else
        {
            Debug.LogError("PlayerHealth is null!");
        }
    }
}
